<?php

declare(strict_types=1);

namespace App\Records\Contracts;

/**
 * A committed fact an owner raises when a record changed, so whatever shows it elsewhere reads it again. It names the
 * record only; the fresh read decides what each viewer sees.
 */
interface RecordChanged extends RecordFact {}
