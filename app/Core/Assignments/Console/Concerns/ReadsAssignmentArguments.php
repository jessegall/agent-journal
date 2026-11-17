<?php

declare(strict_types=1);

namespace App\Core\Assignments\Console\Concerns;

use App\Core\Assignments\Exceptions\InvalidAssignmentIdentity;

/**
 * The record and actors an assignment command names: the record by its type and id arguments, an actor written as
 * kind:id in an option. The launch decides who calls, never an option.
 */
trait ReadsAssignmentArguments
{
    /**
     * @return array{recordType: string, recordId: int}
     */
    protected function recordFields(): array
    {
        return ['recordType' => (string) $this->argument('type'), 'recordId' => (int) $this->argument('id')];
    }

    /**
     * An actor written as kind:id, such as agent:12 or user:1, as the two fields named by the prefix.
     *
     * @return array<string, string|int>
     *
     * @throws InvalidAssignmentIdentity
     */
    protected function actorFields(string $option, string $prefix): array
    {
        $text = $this->option($option);

        if (! is_string($text) || preg_match('/^(agent|user):([1-9][0-9]*)$/', $text, $parts) !== 1) {
            throw InvalidAssignmentIdentity::forActorText(is_string($text) ? $text : '');
        }

        return ["{$prefix}Kind" => $parts[1], "{$prefix}Id" => (int) $parts[2]];
    }
}
