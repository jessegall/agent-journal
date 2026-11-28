<?php

declare(strict_types=1);

namespace App\Support\Recordings;

use App\Support\Recordings\Enums\Wire;

/**
 * The call recorder of each wire, one to a wire.
 */
final readonly class CallRecorders
{
    public function __construct(private RecordingDrafts $drafts) {}

    public function of(Wire $wire): CallRecorder
    {
        return new CallRecorder($wire, $this->drafts);
    }
}
