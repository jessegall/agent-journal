<?php

declare(strict_types=1);

namespace App\Contracts\Records;

use App\Data\Pages\RecordCard;
use App\Exceptions\RecordUnavailable;
use App\Exceptions\UnknownLinkType;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use Illuminate\Database\Eloquent\Model;

/**
 * Reads any record by its link alias through the provider its owner domain registered, never naming a domain.
 */
interface RecordResolver
{
    /**
     * Every record type a domain registered a provider for.
     *
     * @return list<string>
     */
    public function types(): array;

    /**
     * The record users named, such as doc 12, through the provider whose word it uses.
     *
     * @throws UnknownLinkType|RecordUnavailable
     */
    public function identify(RecordReference $reference): RecordIdentity;

    /**
     * @throws UnknownLinkType|RecordUnavailable
     */
    public function card(RecordIdentity $record): RecordCard;

    /**
     * The cards of the records the actor may see, grouped by type so each provider is asked once.
     *
     * @param  list<RecordIdentity>  $records
     * @return list<RecordCard>
     */
    public function visibleCards(array $records): array;

    /**
     * The cards of the records linked to this one that the actor may see; a link they may not see, or to a record
     * no provider answers for, is left out without a count.
     *
     * @return list<RecordCard>
     */
    public function linkedCards(Model $record): array;

    /**
     * @throws UnknownLinkType|RecordUnavailable
     */
    public function requireReadable(RecordIdentity $record): Model;

    /**
     * @throws UnknownLinkType|RecordUnavailable
     */
    public function requireWritable(RecordIdentity $record): Model;
}
