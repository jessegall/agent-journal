<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Values\StackTarget;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Values\InstructionMarker;
use Illuminate\Contracts\Cache\Repository;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The session marker cache: for each frame of a session, which instruction it produces, kept for an hour and free to
 * be evicted. A miss only means the instruction is worked out again; the marker never selects or authorizes work.
 */
final readonly class InstructionMarkers
{
    public const int LIFETIME_SECONDS = 3600;

    public function __construct(private Repository $cache) {}

    public function replace(StackTarget $target, string $frameId, InstructionMarker $marker): void
    {
        $this->cache->put(self::keyOf($target, $frameId), [
            'type' => $marker->instructionType,
            'subject' => $marker->subjectId,
            'run' => $marker->runNumber,
        ], self::LIFETIME_SECONDS);
    }

    public function forget(StackTarget $target, string $frameId): void
    {
        $this->cache->forget(self::keyOf($target, $frameId));
    }

    /**
     * The frame's marker while its stack is open; nothing once the stack is closed or the marker is gone.
     *
     * @return Option<InstructionMarker>
     */
    public function lookup(StackTarget $target, string $frameId): Option
    {
        $stored = $this->cache->get(self::keyOf($target, $frameId));

        if (! is_array($stored) || AgentStackRow::activeFor($target)->isEmpty()) {
            return None::create();
        }

        $marker = new InstructionMarker((string) $stored['type'], (string) $stored['subject'], (int) $stored['run']);

        return Some::create($marker);
    }

    private static function keyOf(StackTarget $target, string $frameId): string
    {
        return "hooks.instruction.{$target->sessionId}.{$frameId}";
    }
}
