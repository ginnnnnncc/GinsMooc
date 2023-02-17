import { useApiAccess } from "@/plugins/apiAccess"

const apiAccess = useApiAccess()
declare module 'vue' {
    interface ComponentCustomProperties {
        $apiAccess: typeof apiAccess
    }
}