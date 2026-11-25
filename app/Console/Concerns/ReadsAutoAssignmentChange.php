<?php

declare(strict_types=1);

namespace App\Console\Concerns;

use App\Api\Assignments\ConfigureAutoAssignmentPayload;
use App\Api\Assignments\EnableAutoAssignmentPayload;
use App\Exceptions\InvalidActorText;
use Closure;

/**
 * The change an enable or configure command sends: its auto-assignment key and the pool its options describe. Task
 * numbers and a plan number are sent as users name the records, such as task 3, for the journal to look up.
 */
trait ReadsAutoAssignmentChange
{
    use ReadsAutoAssignmentKey;
    use RunsApiPipelines;

    /**
     * Runs the enable or configure call the command builds from its options; actor text that does not read fails
     * before anything is sent.
     *
     * @param  Closure(array<string, mixed>): (EnableAutoAssignmentPayload|ConfigureAutoAssignmentPayload)  $call
     */
    protected function runChange(Closure $call): int
    {
        try {
            $fields = $this->changeFields((int) $this->option('size'));

            $change = $call([
                ...$fields,
                'requestKey' => $this->requestKey(),
            ]);
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->runCall($change);
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
