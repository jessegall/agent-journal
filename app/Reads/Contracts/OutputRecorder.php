<?php

declare(strict_types=1);

namespace App\Reads\Contracts;

use App\Models\Runs\PartRun;
use App\Reads\Values\OutputPosition;
use App\Values\CapturedChunk;
use App\Values\PartEnd;

/**
 * Keeps every byte a part writes, from byte zero.
 */
interface OutputRecorder
{
    /**
     * Keeps the captured chunk of output, and gives where it was written.
     */
    public function append(CapturedChunk $chunk): OutputPosition;

    /**
     * Closes the part's output once it ended.
     */
    public function finish(PartRun $part, PartEnd $end): void;
}
