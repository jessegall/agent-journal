<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use App\Bus\Exceptions\CommandTransactionMissing;
use App\Links\Exceptions\UnknownLinkType;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use App\Records\Support\TransactionalRecordLinker;
use Illuminate\Container\Attributes\Bind;
use Illuminate\Database\Eloquent\Model;

/**
 * Links and unlinks records inside the running bus command: the source must be the actor's to change and each target
 * readable to them. It joins the command's transaction and never opens one.
 */
#[Bind(TransactionalRecordLinker::class)]
interface RecordLinker
{
    /**
     * Links a record the caller already holds to each target; a link that exists is left as it is.
     *
     * @param  list<RecordIdentity>  $targets
     *
     * @throws CommandTransactionMissing|UnknownLinkType|RecordUnavailable
     */
    public function linkFrom(Model $source, array $targets): void;

    /**
     * @throws CommandTransactionMissing|UnknownLinkType|RecordUnavailable
     */
    public function link(RecordIdentity $source, RecordIdentity $target): void;

    /**
     * @throws CommandTransactionMissing|UnknownLinkType|RecordUnavailable
     */
    public function unlink(RecordIdentity $source, RecordIdentity $target): void;
}
