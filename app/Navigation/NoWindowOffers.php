<?php

declare(strict_types=1);

namespace App\Navigation;

use App\Navigation\Contracts\WindowOffers;
use App\Support\RecordIdentity;
use PhpOption\None;
use PhpOption\Option;

/**
 * Nothing is offered on any window, for a journal with no domain that offers anything for a shown record.
 */
final readonly class NoWindowOffers implements WindowOffers
{
    public function offerFor(RecordIdentity $record): Option
    {
        return None::create();
    }
}
