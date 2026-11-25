<?php

declare(strict_types=1);

namespace App\Enums\Runs;

/**
 * How far a part's output was interpreted: no approved reader yet, read while still running, read whole and valid,
 * read whole with problems, or the reader itself failed.
 */
enum InterpretationState: string
{
    case AwaitingReader = 'awaiting_reader';
    case Provisional = 'provisional';
    case Valid = 'valid';
    case Invalid = 'invalid';
    case ReaderFailed = 'reader_failed';
}
