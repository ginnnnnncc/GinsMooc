package top.ginnnnnn.mooc.service.implement;

import java.security.SecureRandom;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import top.ginnnnnn.mooc.service.GameService;

@Service
public class GameServiceImpl implements GameService {

    private static final SecureRandom RNG = new SecureRandom();
    private static final String GUESS_GAME_PREFIX = "GinsGame-guess-";
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    public HashMap<String, Object> guess(String token, Double guess) {
        final String key = GUESS_GAME_PREFIX + token;
        init(key);
        HashOperations<String, String, Object> hashOperations = stringRedisTemplate.opsForHash();

        Double number = Double.valueOf((String)hashOperations.get(key, "number"));
        boolean isLess = number > guess + 1e-6 / 2;
        boolean isMore = number < guess - 1e-6 / 2;

        boolean isPassed = !isLess && !isMore;
        boolean isTalented = isPassed && !hashOperations.hasKey(key, "previous");

        HashMap<String, Object> state = new HashMap<>(5);
        state.put("less", isLess);
        state.put("more", isMore);

        hashOperations.putIfAbsent(key, "previous", "0");
        hashOperations.increment(key, "previous", 1);
        if (isPassed) {
            hashOperations.put(key, "number", String.format("%f", RNG.nextInt(1, 1000000) * 1e-6));
            hashOperations.delete(key, "previous");
            hashOperations.increment(key, "passed", 1);
        }
        if (isTalented) {
            hashOperations.increment(key, "talented", 1);
            state.put("reward", Boolean.TRUE);
        } else {
            state.put("reward", Boolean.FALSE);
        }

        HashMap<String, Object> ret = new HashMap<>(3);
        ret.put("info", infoBuild(key));
        ret.put("state", state);
        return ret;

    }

    public HashMap<String, Object> getState(String token) {
        final String key = GUESS_GAME_PREFIX + token;
        init(key);
        return infoBuild(key);
    }

    public boolean refresh(String token) {
        final String key = GUESS_GAME_PREFIX + token;
        init(key);
        HashOperations<String, String, Object> hashOperations = stringRedisTemplate.opsForHash();

        hashOperations.put(key, "passed", "0");
        hashOperations.put(key, "talented", "0");
        hashOperations.put(key, "number", String.format("%f", RNG.nextInt(1, 1000000) * 1e-6));
        hashOperations.delete(key, "previous");
        return true;
    }

    private void init(String key) {
        HashOperations<String, String, Object> hashOperations = stringRedisTemplate.opsForHash();
        hashOperations.putIfAbsent(key, "passed", "0");
        hashOperations.putIfAbsent(key, "talented", "0");
        hashOperations.putIfAbsent(key, "number", String.format("%f", RNG.nextInt(1, 1000000) * 1e-6));
    }

    private HashMap<String, Object> infoBuild(String key) {
        HashOperations<String, String, Object> hashOperations = stringRedisTemplate.opsForHash();
        HashMap<String, Object> info = new HashMap<>(3);
        info.put("passed", hashOperations.get(key, "passed"));
        info.put("talented", hashOperations.get(key, "talented"));
        return info;
    }

}
