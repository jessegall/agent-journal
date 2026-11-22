<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\PartRun;
use App\Values\CapturedChunk;
use App\Values\OutputPosition;
use App\Values\PartEnd;

/**
 * Keeps every byte a part writes, from byte zero (doc 21 revision 6, sections 54 and 55).
 */
interface OutputRecorder
{
    public function append(CapturedChunk $chunk): OutputPosition;

    public function finish(PartRun $part, PartEnd $end): void;
}
