<?php

declare(strict_types=1);

namespace App\Supervision\Contracts;

use App\Supervision\Data\AskCard;
use App\Supervision\Data\AskInbox;
use App\Supervision\Values\AskReference;

interface AskReader
{
    public function card(AskReference $reference): AskCard;

    public function inbox(AskReference|null $before = null): AskInbox;
}
