<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Records\Support\RecordIdentity;

/**
 * A public assignment admitted for writing: the record, the recipient the caller asked for and the holder that
 * recipient resolves to, itself or the desk it forwards to.
 */
final readonly class AdmittedAssignment
{
    public function __construct(
        public RecordIdentity $record,
        public AssigneeIdentity $requested,
        public AssigneeIdentity $resolved,
    ) {}

    public function request(): AssignmentRequest
    {
        return new AssignmentRequest($this->requested, $this->resolved);
    }
}
