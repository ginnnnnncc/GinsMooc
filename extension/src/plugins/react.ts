import { randomString } from "./tool"

class CustomRefList extends Array<CustomRef<any>> {
    id: string
    node: HTMLElement

    constructor() {
        super()
        this.node = document.createElement("gin")
        this.id = randomString(8)
        this.node.id = `gin-auto-${this.id}`
        document.body.appendChild(this.node)
    }

    add<T>(value: T): CustomRef<T> {
        const add = new CustomRef(this, value)
        super.push(add)
        return add
    }
}

class CustomRef<T> {
    id: string
    node: HTMLElement
    parent: CustomRefList
    value: T

    constructor(parent: CustomRefList, value: T) {
        this.parent = parent
        this.node = document.createElement("gin")
        this.id = randomString(8)
        this.node.id = this.id
        this.parent.node.appendChild(this.node)
        this.value = value
    }

    get(): T {
        return this.value
    }

    set(value: T): void {
        if (this.value !== value) {
            const oldValue = this.value
            this.value = value
            this.node.dispatchEvent(new CustomEvent("change", { detail: { oldValue, newValue: this.value } }))
        }
        this.node.dispatchEvent(new CustomEvent("set"))
    }

    addEventListenr(eventName: "change" | "set", callback: (ev: Event) => void): void {
        this.node.addEventListener(eventName, callback)
    }
}

export { CustomRefList }