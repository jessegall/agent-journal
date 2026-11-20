<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use Domain\Documents\Api\RetainedDraftView;

interface DraftReader
{
    public function draft(string $id): RetainedDraftView;
}
