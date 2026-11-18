<?php

declare(strict_types=1);

namespace App\Assignments\Console\Concerns;

use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\ActorIdentity;

/**
 * The auto-assignment an auto-assignment command names by its actor and type arguments, and the pool its options
 * describe: task numbers and a plan number are sent as people name the records, such as task 3, for the journal to
 * look up. The launch decides who calls, never an option.
 */
trait ReadsAutoAssignmentArguments
{
    /**
     * @return array<string, string|int>
     *
     * @throws InvalidActorText
     */
    protected function keyFields(): array
    {
        return [
            ...ActorIdentity::fromText((string) $this->argument('actor'))->asFields('actor'),
            'assignableType' => (string) $this->argument('type'),
        ];
    }

    /**
     * @return array<string, mixed>
     *
     * @throws InvalidActorText
     */
    protected function changeFields(int $size): array
    {
        $plan = (string) $this->option('plan');

        return [
            ...$this->keyFields(),
            'pool' => (string) $this->option('pool'),
            'records' => array_map(fn (mixed $number) => "task {$number}", (array) $this->option('task')),
            'target' => $plan === '' ? null : "plan {$plan}",
            'size' => $size,
            'expectedRevision' => (int) $this->option('revision'),
        ];
    }
}
