from collections.abc import Callable

from journal.features.profiles.support.profile_files import ProfileFiles
from journal.features.templates.shipped import JOURNAL_TESTS
from journal.features.workers.support.allowed_models import AllowedModels
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.support.worker_launch import WorkerLaunch
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.models.worker import Worker
from journal.providers.providers import Providers
from journal.providers.support.profile_type import ProfileType
from journal.repositories.tasks import Tasks
from journal.repositories.templates import Templates
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.rejection import Rejection
from journal.support.time_source import TimeSource
from journal.support.worktree_failure import WorktreeFailure

# what a worker the journal sends is told it changes
CHANGES = "what your task's brief names"
# the names the journal's own workers take in turn, each a figure with a twist on their trade
NAMES = ("Mr. Brunel, builder of the next span", "Lady Lovelace, weaver of the next loop", "Mr. Babbage, keeper of the next gear",
         "Miss Hopper, finder of the next bug", "Mr. Turing, reader of the next tape", "Mrs. Somerville, joiner of the next sciences",
         "Mr. Telford, layer of the next road", "Miss Franklin, maker of the next picture", "Mr. Shannon, carrier of the next signal",
         "Mrs. Hamilton, writer of the next landing")


class WorkerDispatch:
    """A worker sent on a task, the one way the agent's dispatch and the journal's own take: a worker profile, the model its profile and the allowed models give it, the testing brief, a worker the journal sends on a task shaped as another, and the send itself, its row saved, its workplace made, its task handed over and its process started; a workplace that cannot be made deletes the row and refuses."""

    def __init__(self, workers: Workers, runner: WorkerRunner, tasks: Tasks, launch: WorkerLaunch, branch: WorkerBranch, profiles: ProfileFiles, providers: Providers, allowed: AllowedModels, templates: Templates, time_source: TimeSource) -> None:
        self.time_source = time_source
        self.workers, self.runner, self.tasks, self.launch, self.branch = workers, runner, tasks, launch, branch
        self.profiles, self.providers, self.allowed, self.templates = profiles, providers, allowed, templates

    def worker_profile(self, profile: str) -> None:
        if self.profiles.profile_type(profile) != ProfileType.WORKER:
            raise Rejection(f"{profile} is no worker profile: use --profile journal-senior or journal-medior")

    def model(self, profile: str, provider: str) -> str:
        return self.providers.lookup(provider).profile_model(self.profiles.read(profile))

    def allowed_model(self, provider: str, profile: str, model: str) -> tuple[str, str]:
        return self.allowed.clamped(provider, profile, model)

    def testing_brief(self) -> str:
        matches = self.templates.testing_titled(JOURNAL_TESTS.title, "worker")
        if not matches:
            raise Rejection(f"no test template is titled {JOURNAL_TESTS.title}: name one with --tests, {', '.join(template.title for template in self.templates.testing('worker'))}")
        return matches[0].brief

    def shaped(self, shape: Worker, task: Task, dispatcher: str | None) -> Worker:
        self.worker_profile(shape.profile)
        model, _ = self.allowed_model(shape.provider, shape.profile, self.model(shape.profile, shape.provider))
        brief = "\n\n".join((task.brief, f"You change: {CHANGES}", f"How you test: {self.testing_brief()}"))
        return Worker(name=NAMES[task.row_id % len(NAMES)], brief=brief, provider=shape.provider, model=model, profile=shape.profile, worktree=shape.worktree, library_links=shape.library_links, library_copies=shape.library_copies, dispatcher=dispatcher).contacted(self.time_source.seconds())

    def sent(self, worker: Worker, task: Task, actor: Actor, move: Callable[[Worker, float], Worker] = Worker.dispatched) -> Worker:
        try:
            repositories = self.runner.workplace(worker)
        except WorktreeFailure as failed:
            self.workers.delete(worker, actor)
            raise Rejection(f"worker {worker.name} was not dispatched: {failed}") from failed
        self.tasks.handover(task, Ref.build(worker), actor)
        return self.launch.launched(worker, actor, repositories, self.branch.name(worker) if worker.worktree else "", move)
