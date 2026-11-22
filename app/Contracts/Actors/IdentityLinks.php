<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Exceptions\CommandTransactionMissing;
use App\Exceptions\UnknownLinkType;
use App\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Links a record Core holds to a record named only by its identity, and reads those links back, without ever loading
 * the named record: an agent's session links to the account it used while the account stays its owner's to read.
 */
interface IdentityLinks
{
    /**
     * Links the record to the named one inside the running bus command; a link that exists is left as it is.
     *
     * @throws CommandTransactionMissing|UnknownLinkType
     */
    public function link(Model $record, RecordIdentity $other): void;

    /**
     * The identities of the records of one link alias linked to the record.
     *
     * @return list<RecordIdentity>
     */
    public function linkedOfType(Model $record, string $type): array;

    /**
     * Narrows a query of records the caller may read to those linked to the named record.
     *
     * @template TBuilder of Builder<*>
     *
     * @param  TBuilder  $records
     * @return TBuilder
     */
    public function among(Builder $records, RecordIdentity $other): Builder;
}
