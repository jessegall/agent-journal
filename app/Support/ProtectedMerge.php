<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\MergeRefusalReason;
use App\Models\Reviews\MergeAttempt;
use Illuminate\Contracts\Process\ProcessResult;
use Illuminate\Process\Factory;

/**
 * Publishes the exact reviewed head onto the target branch with a no-fast-forward merge built in a temporary
 * worktree, where no hook, include or credential helper runs. A conflict, a reviewed head that moved, overlapping
 * local changes or a target that moved during publication leave the target as it was; nothing is forced, stashed,
 * reset or pushed. The result is kept under its own ref before the target is moved.
 */
final readonly class ProtectedMerge
{
    /**
     * The longest one git step of a merge may take.
     */
    private const int STEP_SECONDS_LIMIT = 120;

    /**
     * Git settings that keep the merge from running anything the checkout or the user's configuration could name.
     */
    private const array SAFE_SETTINGS = [
        'core.hooksPath=/dev/null',
        'core.fsmonitor=false',
        'credential.helper=',
        'protocol.allow=never',
        'user.name=Agent Journal',
        'user.email=journal@localhost',
    ];

    public function __construct(private Factory $processes, private string $repository) {}

    /**
     * Ends an attempt a run left behind by what git shows: a published result is merged, a target unchanged with no
     * result kept is no effect and merges again, and anything else is uncertain.
     */
    public function inspect(MergeAttempt $attempt): void
    {
        $branch = "refs/heads/{$attempt->target_branch}";
        $target = $this->revision($branch);
        $result = $this->revision($attempt->resultRef);

        if ($result !== '' && $result === $target) {
            $attempt->merged($result);

            return;
        }

        if ($result === '' && ($attempt->target_before === null || $attempt->target_before === $target)) {
            $this->merge($attempt);

            return;
        }

        $attempt->becomeUncertain(
            "The target is {$target} and the kept result is {$result}; neither proves the effect.",
        );
    }

    public function merge(MergeAttempt $attempt): void
    {
        if ($this->revision($attempt->import_ref) !== $attempt->head) {
            $attempt->refuse(
                MergeRefusalReason::ChangedReviewedHead,
                "{$attempt->import_ref} no longer names the reviewed head.",
            );

            return;
        }

        $branch = "refs/heads/{$attempt->target_branch}";
        $target = $this->revision($branch);
        $attempt->apply($target);

        if ($this->git($this->repository, ['merge-base', '--is-ancestor', $attempt->head, $target])->successful()) {
            $attempt->merged($target);

            return;
        }

        $result = $this->build($attempt, $target);

        if ($result === null) {
            return;
        }

        $this->git($this->repository, ['update-ref', $attempt->resultRef, $result]);
        $this->publish($attempt, $branch, $target, $result);
    }

    /**
     * The merge commit of the reviewed head onto the target, built in a worktree of its own; a conflict refuses.
     */
    private function build(MergeAttempt $attempt, string $target): string|null
    {
        $folder = sys_get_temp_dir()."/journal-merge-{$attempt->id}";
        $this->git($this->repository, ['worktree', 'add', '--detach', '--force', $folder, $target]);
        $message = "Merge reviewed work {$attempt->work_id}";
        $merge = $this->git($folder, ['merge', '--no-ff', '--no-edit', '-m', $message, $attempt->head]);
        $result = $merge->successful() ? $this->revision('HEAD', $folder) : null;

        if ($result === null) {
            $conflicts = trim($this->git($folder, ['diff', '--name-only', '--diff-filter=U'])->output());
            $this->git($folder, ['merge', '--abort']);
            $attempt->refuse(MergeRefusalReason::Conflict, "Conflicting paths on {$target}:\n{$conflicts}");
        }

        $this->git($this->repository, ['worktree', 'remove', '--force', $folder]);

        return $result;
    }

    /**
     * Moves the target to the result: a fast-forward in its checkout when it is checked out, which refuses
     * overlapping local changes, else a compare-and-set of the ref, which refuses a target that moved.
     */
    private function publish(MergeAttempt $attempt, string $branch, string $target, string $result): void
    {
        $checkedOut = trim($this->git($this->repository, ['symbolic-ref', '--quiet', 'HEAD'])->output()) === $branch;

        $published = $checkedOut
            ? $this->git($this->repository, ['merge', '--ff-only', '--quiet', $result])
            : $this->git($this->repository, ['update-ref', $branch, $result, $target]);

        if ($published->successful()) {
            $attempt->merged($result);

            return;
        }

        $attempt->refuse(
            $checkedOut ? MergeRefusalReason::OverlappingLocalChanges : MergeRefusalReason::ChangedTarget,
            trim($published->errorOutput()),
        );
    }

    private function revision(string $name, string|null $folder = null): string
    {
        return trim($this->git($folder ?? $this->repository, ['rev-parse', '--verify', '--quiet', $name])->output());
    }

    /**
     * @param  list<string>  $arguments
     */
    private function git(string $folder, array $arguments): ProcessResult
    {
        $settings = array_merge(...array_map(fn (string $setting) => ['-c', $setting], self::SAFE_SETTINGS));

        return $this->processes
            ->newPendingProcess()
            ->path($folder)
            ->timeout(self::STEP_SECONDS_LIMIT)
            ->env(['GIT_CONFIG_NOSYSTEM' => '1', 'GIT_CONFIG_GLOBAL' => '/dev/null', 'GIT_TERMINAL_PROMPT' => '0'])
            ->run(['git', ...$settings, ...$arguments]);
    }
}
