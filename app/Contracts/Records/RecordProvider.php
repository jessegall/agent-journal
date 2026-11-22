<?php

declare(strict_types=1);

namespace App\Contracts\Records;

use App\Data\RecordCard;
use App\Exceptions\RecordUnavailable;
use App\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Model;

/**
 * What the owner of one record type answers for links, under the current actor: its card, the record to read or to
 * change, and which of many records the actor may see. A missing record and one the actor may not read fail alike.
 */
interface RecordProvider
{
    /**
     * The word people name these records by, such as doc in doc 12.
     */
    public function referenceWord(): string;

    /**
     * The record of this number.
     *
     * @throws RecordUnavailable
     */
    public function identityOf(int $number): RecordIdentity;

    /**
     * @throws RecordUnavailable
     */
    public function card(RecordIdentity $record): RecordCard;

    /**
     * @throws RecordUnavailable
     */
    public function requireReadable(RecordIdentity $record): Model;

    /**
     * @throws RecordUnavailable when the record is missing, unreadable, or readable but not to be changed by the actor
     */
    public function requireWritable(RecordIdentity $record): Model;

    /**
     * The cards of the records the actor may see, in the order given; the others are left out without saying why.
     *
     * @param  list<RecordIdentity>  $records
     * @return list<RecordCard>
     */
    public function visibleCards(array $records): array;
}
