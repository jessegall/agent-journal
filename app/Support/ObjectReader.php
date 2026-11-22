<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\WorkspaceReadPending;
use App\Values\ObjectRead;
use App\Values\ScriptContext;
use Throwable;

/**
 * Reads one member of a script object built for a run's context. A read the host still owes suspends the instruction
 * on its reference; any other failure becomes a diagnostic the run reports, never a false value it would branch on.
 * This is the one boundary where a failed member read is caught and turned into a diagnostic.
 */
final readonly class ObjectReader
{
    public function __construct(private ObjectRegistry $objects) {}

    public function read(string $objectKey, string $member, ScriptContext $context): ObjectRead
    {
        try {
            $value = $this->objects->make($objectKey, $context)->{$member};
        } catch (WorkspaceReadPending $pending) {
            return ObjectRead::pending($pending->reference->key);
        } catch (Throwable $failure) {
            return ObjectRead::failed("Reading {$objectKey}.{$member} failed: {$failure->getMessage()}");
        }

        return ObjectRead::value($value);
    }
}
