<?php

declare(strict_types=1);

namespace App\Asks\Contracts;

use App\Asks\Data\AskCard;
use App\Asks\Data\AskDetail;
use App\Asks\Data\AskInbox;
use App\Values\AskReference;

interface AskReader
{
    /**
     * The ask as its card shows it.
     */
    public function card(AskReference $reference): AskCard;

    /**
     * The asks waiting for the reader, older than the one given when reading on.
     */
    public function inbox(AskReference|null $before = null): AskInbox;

    /**
     * One ask the reader may see, read without answering or taking anything.
     */
    public function detail(AskReference $reference): AskDetail;
}
