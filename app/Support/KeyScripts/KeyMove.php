<?php

declare(strict_types=1);

namespace App\Support\KeyScripts;

use App\Data\Hosts\HostFrameData;
use App\Enums\Navigation\NavigationReason;
use App\Enums\Screens\KeyMoveType;
use App\Support\Screens\RowRange;
use App\Values\RowGuard;

/**
 * What a key script does on one frame: wait, send keys guarded by the rows they were read on, finish, or stop without
 * a key, with the run as it stands after it.
 */
final readonly class KeyMove
{
    private function __construct(
        public KeyMoveType $type,
        public KeyScriptRun $run,
        public string $keys = '',
        public RowRange|null $guarded = null,
        public NavigationReason|null $reason = null,
    ) {}

    public static function wait(KeyScriptRun $run): self
    {
        return new self(KeyMoveType::Wait, $run);
    }

    public static function send(KeyScriptRun $run, string $keys, RowRange $guarded): self
    {
        return new self(KeyMoveType::Send, $run, $keys, $guarded);
    }

    public static function finished(KeyScriptRun $run): self
    {
        return new self(KeyMoveType::Finished, $run);
    }

    public static function uncertain(KeyScriptRun $run, NavigationReason $reason): self
    {
        return new self(KeyMoveType::Uncertain, $run, reason: $reason);
    }

    public static function failed(KeyScriptRun $run): self
    {
        return new self(KeyMoveType::Failed, $run);
    }

    /**
     * The guard the move's keys carry: the rows they were read on, or the whole screen.
     */
    public function guardOn(HostFrameData $frame): RowGuard
    {
        return ($this->guarded ?? new RowRange(0, count($frame->rows)))->guardOn($frame);
    }
}
