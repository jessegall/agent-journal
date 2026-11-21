<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * What starting a journal verb's run answered: whether this request started it now, whether an earlier start of
 * the request key still runs, and the frames an earlier run recorded.
 */
final readonly class CommandRunStart
{
    /**
     * @param  list<CommandFrame>  $recordedFrames
     */
    public function __construct(public bool $isNew, public bool $isRunning, public array $recordedFrames) {}
}
