<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Data\Asks\AskCard;
use App\Data\Asks\AskDetail;
use App\Data\Asks\AskInbox;
use App\Values\AskReference;

interface AskReader
{
    public function card(AskReference $reference): AskCard;

    public function inbox(AskReference|null $before = null): AskInbox;

    /**
     * One ask the reader may see, read without answering or taking anything.
     */
    public function detail(AskReference $reference): AskDetail;
}
