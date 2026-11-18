<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Values\OutputFrame;
use App\Processes\Values\PartEnd;
use App\Processes\Values\ReaderAssessment;
use App\Processes\Values\ReaderCheckpoint;

/**
 * Reads a part's committed output (doc 21 revision 6, section 72): read takes new frames from a checkpoint and returns
 * the next checkpoint with provisional records; finish takes the complete streams and the authentic part end and
 * returns the assessment. A reader never builds a result receipt.
 */
interface OutputReader
{
    public function read(ReaderCheckpoint $from, OutputFrame ...$frames): ReaderCheckpoint;

    public function finish(ReaderCheckpoint $at, PartEnd $end): ReaderAssessment;
}
