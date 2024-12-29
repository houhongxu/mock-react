import {
  createContainer,
  updateContainer,
} from 'react-reconciler/src/ReactFiberReconciller'
import { FiberRootNode } from 'react-reconciler/src/ReactFiberRoot'
import { ConcurrentRoot } from 'react-reconciler/src/ReactRootTags'
import { Container, ReactElement } from 'shared/ReactTypes'

class ReactDOMRoot {
  private _internalRoot: FiberRootNode

  constructor(internalRoot: FiberRootNode) {
    this._internalRoot = internalRoot
  }

  render(children: ReactElement) {
    const root = this._internalRoot

    updateContainer(children, root, null)
  }
}

export function createRoot(container: Container) {
  const root = createContainer(container, ConcurrentRoot)

  return new ReactDOMRoot(root)
}
