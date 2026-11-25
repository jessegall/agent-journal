<?php

declare(strict_types=1);

namespace App\Support;

use App\CommandMiddleware\AdmitStack;
use App\CommandMiddleware\AuthorizeCommand;
use App\CommandMiddleware\BindDispatcher;
use App\CommandMiddleware\CheckEntry;
use App\CommandMiddleware\CheckJobGrant;
use App\CommandMiddleware\GuardCommandOrigin;
use App\CommandMiddleware\LogCommand;
use App\CommandMiddleware\RecordReceipt;
use App\CommandMiddleware\RecordRefusalReceipt;
use App\CommandMiddleware\RefuseMissingModels;
use App\CommandMiddleware\RefuseWritesDuringReads;
use App\CommandMiddleware\RunInTransaction;
use App\CommandMiddleware\ValidateCommand;
use App\Contracts\Bus\CommandMiddleware;

/**
 * The core middleware frame around the module middleware and handler.
 */
final class CommandFrame
{
    /**
     * The Core steps before the module middleware of the BeforeTransaction stage.
     *
     * @var list<class-string<CommandMiddleware>>
     */
    public const array FIRST = [
        LogCommand::class,
        RefuseWritesDuringReads::class,
        CheckEntry::class,
        BindDispatcher::class,
        ValidateCommand::class,
        AdmitStack::class,
        RecordRefusalReceipt::class,
        RefuseMissingModels::class,
    ];

    /**
     * The Core step that opens or joins the command's transaction.
     *
     * @var class-string<CommandMiddleware>
     */
    public const string TRANSACTION = RunInTransaction::class;

    /**
     * The Core steps inside the transaction, before the module middleware of the InsideTransaction stage.
     *
     * @var list<class-string<CommandMiddleware>>
     */
    public const array INSIDE = [
        GuardCommandOrigin::class,
        CheckJobGrant::class,
        AuthorizeCommand::class,
        RecordReceipt::class,
    ];
}
