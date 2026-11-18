<?php

declare(strict_types=1);

namespace App\Assignments\Console\Concerns;

use App\Actors\Exceptions\InvalidActorText;

/**
 * The change an enable or configure command sends: its auto-assignment key and the pool its options describe. Task
 * numbers and a plan number are sent as people name the records, such as task 3, for the journal to look up.
 */
trait ReadsAutoAssignmentChange
{
    use ReadsAutoAssignmentKey;

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
