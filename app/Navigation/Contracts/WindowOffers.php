<?php

declare(strict_types=1);

namespace App\Navigation\Contracts;

use App\Navigation\Data\WindowOfferData;
use App\Support\RecordIdentity;
use PhpOption\Option;

/**
 * What a window showing one record offers to do with it, such as adding it to a conversation: none when no installed
 * domain offers anything, or the viewer may not read the record.
 */
interface WindowOffers
{
    /**
     * The offer for the record a window shows, or none.
     *
     * @return Option<WindowOfferData>
     */
    public function offerFor(RecordIdentity $record): Option;
}
