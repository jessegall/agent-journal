<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts\Drafts;

use Domain\Documents\Values\RetainedDraftView;

interface DraftReader
{
    public function draft(string $id): RetainedDraftView;
}
