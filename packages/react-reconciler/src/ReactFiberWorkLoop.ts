import { Fiber, createWorkInProgress } from './ReactFiber'
import { beginWork } from './ReactFiberBeginWork'
import { completeWork } from './ReactFiberCompleteWork'
import { NoFlags } from './ReactFiberFlags'
import { SyncLane } from './ReactFiberLane'
import { FiberRoot } from './ReactFiberRoot'
import { HostRoot } from './ReactWorkTags'
import { clone } from 'shared/clone'

type RootExitStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6

const RootInProgress = 0
const RootFatalErrored = 1
const RootErrored = 2
const RootSuspended = 3
const RootSuspendedWithDelay = 4
const RootCompleted = 5
const RootDidNotComplete = 6

let workInProgressRoot: FiberRoot | null = null

let workInProgress: Fiber | null = null

let workInProgressRootExitStatus: RootExitStatus = RootInProgress

function markUpdateLaneFromFiberToRoot(fiber: Fiber) {
  if (fiber.tag === HostRoot) {
    return fiber.stateNode as FiberRoot
  }
}

function completeUnitOfWork(unitOfWork: Fiber) {
  console.log('(completeUnitOfWork)', clone(unitOfWork))

  let completedWork: Fiber | null = unitOfWork

  do {
    const current = completedWork.alternate
    const returnFiber: Fiber | null = completedWork.return

    let next: Fiber | null

    next = completeWork(current, completedWork)

    if (next !== null) {
      workInProgress = next
      return
    }

    const siblingFiber = completedWork.sibling

    if (siblingFiber !== null) {
      workInProgress = siblingFiber
      return
    }

    completedWork = returnFiber
    workInProgress = completedWork
  } while (completedWork !== null)
}

function performUnitOfWork(unitOfWork: Fiber) {
  console.log('------ performUnitOfWork ------')

  const current = unitOfWork.alternate

  let next: Fiber | null

  next = beginWork(current, unitOfWork)

  console.log('(beginWork) return', clone(next))

  if (next === null) {
    completeUnitOfWork(unitOfWork)
  } else {
    workInProgress = next
  }
}

function prepareFreshStack(root: FiberRoot) {
  console.log('(prepareFreshStack)')
  const rootWorkInProgress = createWorkInProgress(root.current, null)

  console.log('(createWorkInProgress) return', clone(rootWorkInProgress))

  workInProgress = rootWorkInProgress
  workInProgressRoot = root
}

function workLoopSync() {
  console.log('(workLoopSync)', clone(workInProgress))

  while (workInProgress !== null) {
    try {
      performUnitOfWork(workInProgress)
    } catch (e) {
      console.error(e)
      break
    }
  }
}

function renderRootSync(root: FiberRoot) {
  console.log('(renderRootSync)')

  if (workInProgressRoot !== root) {
    prepareFreshStack(root)
  }

  do {
    try {
      workLoopSync()
      break
    } catch (thrownValue) {
      console.warn('workLoopSync')
    }
  } while (true)

  return workInProgressRootExitStatus
}

function performSyncWorkOnRoot(root: FiberRoot) {
  console.log('(performSyncWorkOnRoot)')

  let exitStatus = renderRootSync(root)

  if (exitStatus === RootDidNotComplete) {
    console.error('bug')
  }

  const finishedWork = root.current.alternate

  root.finishedWork = finishedWork

  // root.finishedLanes = lanes;

  // commitRoot(root)

  // ensureRootIsScheduled(root)

  return null
}

function ensureRootIsScheduled(root: FiberRoot) {
  console.log('(ensureRootIsScheduled)', clone(root))

  const newCallbackPriority = SyncLane

  if (newCallbackPriority === SyncLane) {
    performSyncWorkOnRoot(root)
  } else {
    // performConcurrentWorkOnRoot()
  }
}

export function scheduleUpdateOnFiber(fiber: Fiber) {
  console.log('(scheduleUpdateOnFiber)', clone(fiber))

  // fiber root
  const root = markUpdateLaneFromFiberToRoot(fiber)!

  // markRootUpdated(root, lane)

  ensureRootIsScheduled(root)
}
