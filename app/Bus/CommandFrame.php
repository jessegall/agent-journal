<?php

declare(strict_types=1);

namespace App\Bus;

use App\Bus\CommandMiddleware\AdmitStack;
use App\Bus\CommandMiddleware\AuthorizeCommand;
use App\Bus\CommandMiddleware\BindDispatcher;
use App\Bus\CommandMiddleware\CheckEntry;
use App\Bus\CommandMiddleware\CheckJobGrant;
use App\Bus\CommandMiddleware\FenceDriverWorker;
use App\Bus\CommandMiddleware\GuardCommandOrigin;
use App\Bus\CommandMiddleware\GuardCommandProject;
use App\Bus\CommandMiddleware\LogCommand;
use App\Bus\CommandMiddleware\RecordReceipt;
use App\Bus\CommandMiddleware\RecordRefusalReceipt;
use App\Bus\CommandMiddleware\RefuseMissingModels;
use App\Bus\CommandMiddleware\RefuseWritesDuringReads;
use App\Bus\CommandMiddleware\RunInTransaction;
use App\Bus\CommandMiddleware\ValidateCommand;
use App\Bus\Contracts\CommandMiddleware;

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
        GuardCommandProject::class,
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
        FenceDriverWorker::class,
        GuardCommandOrigin::class,
        CheckJobGrant::class,
        AuthorizeCommand::class,
        RecordReceipt::class,
    ];
}
