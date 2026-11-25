<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Enums\CommandRules\RedirectType;
use App\Exceptions\SupervisorRefused;
use App\Values\ExecutionContext;
use App\Values\PartKey;
use App\Values\PlanRedirect;
use App\Values\PlanStep;
use App\Values\PlanWord;
use App\Contracts\Processes\SpawnablePart;

/**
 * A part of a run that is queued and not yet run: its step, its key, the context it runs in, the outputs of its
 * substitutions and where its standard input comes from; it knows the words, files and variables it starts with.
 */
final readonly class QueuedPart implements SpawnablePart
{
    /**
     * Variables a part never inherits: the journal's start token and the run's event key.
     */
    private const array SECRET_VARIABLES = [
        'JOURNAL_START_TOKEN',
        'JOURNAL_EVENT_KEY',
    ];

    public const array NO_INPUT = [
        'file',
        '/dev/null',
        'r',
    ];

    /**
     * @param  array<int, string>  $substitutionOutputs
     * @param  array<int, string>  $input
     */
    public function __construct(
        public PlanStep $step,
        public PartKey $part,
        public ExecutionContext $context,
        public RunState $state,
        public array $substitutionOutputs,
        public array $input,
    ) {}

    public function nextSpawnable(): self
    {
        return $this;
    }

    public function spawned(SpawnedPart $part): SpawnedPart
    {
        return $part;
    }

    public function refused(string $reason): SpawnRefused
    {
        return new SpawnRefused($this, $reason);
    }

    /**
     * Why the part's admission went stale while the run was going (a rule it needs was retired), or nothing while
     * the admission holds.
     */
    public function staleReason(): string
    {
        return $this->state->events->staleReason($this->part);
    }

    public function isStale(): bool
    {
        return $this->staleReason() !== '';
    }

    /**
     * @return list<string>
     */
    public function argv(): array
    {
        return array_map($this->text(...), $this->step->argv);
    }

    /**
     * The part's descriptors: its input, its output and errors as pipes, and each redirect in their place.
     *
     * @return array<int, array<int, string|int>>
     */
    public function descriptors(): array
    {
        $descriptors = [0 => $this->input, 1 => ['pipe', 'w'], 2 => ['pipe', 'w']];

        foreach ($this->step->redirects as $redirect) {
            $descriptors[$redirect->descriptor] = $this->descriptor($redirect);
        }

        return $descriptors;
    }

    /**
     * The variables the part starts with: the context's, then its own assignments, never a secret one.
     *
     * @return array<string, string>
     */
    public function environment(): array
    {
        $assigned = array_map($this->text(...), $this->step->assignments);

        return array_diff_key([
            ...$this->context->environment,
            ...$assigned,
        ], array_flip(self::SECRET_VARIABLES));
    }

    private function text(PlanWord $word): string
    {
        return $word->textWith($this->substitutionOutputs);
    }

    /**
     * @return array<int, string|int>
     */
    private function descriptor(PlanRedirect $redirect): array
    {
        $target = $this->text($redirect->target);
        $path = str_starts_with($target, '/') ? $target : rtrim($this->context->workingFolder, '/').'/'.$target;

        return match ($redirect->type) {
            RedirectType::Output, RedirectType::Clobber => [
                'file',
                $path,
                'w',
            ],
            RedirectType::Append => [
                'file',
                $path,
                'a',
            ],
            RedirectType::Input => [
                'file',
                $path,
                'r',
            ],
            RedirectType::DuplicateOutput => [
                'redirect',
                (int) $target,
            ],
            default => throw SupervisorRefused::unsupportedRedirect($redirect->type->value),
        };
    }
}
