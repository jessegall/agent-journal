<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Decisions\SubjectReference;
use App\Records\Support\RecordIdentity;

interface WorkRecordLoader extends StateLoader
{
    public function recordOf(SubjectReference $subject): RecordIdentity;
}
