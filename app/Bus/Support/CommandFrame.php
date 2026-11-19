<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\CommandMiddleware\AdmitStack;
use App\Bus\CommandMiddleware\AuthorizeCommand;
use App\Bus\CommandMiddleware\CheckEntry;
use App\Bus\CommandMiddleware\LogCommand;
use App\Bus\CommandMiddleware\RecordReceipt;
use App\Bus\CommandMiddleware\RecordRefusalReceipt;
use App\Bus\CommandMiddleware\RunInTransaction;
use App\Bus\CommandMiddleware\ValidateCommand;
use App\Bus\Contracts\CommandMiddleware;

/**
 * The order every command passes (doc 19, section 6.5): LogCommand, CheckEntry, ValidateCommand, AdmitStack,
 * RecordRefusalReceipt, the module middleware of the BeforeTransaction stage, RunInTransaction, RecordReceipt (check,
 * then write after the handler), [guard], the module middleware of the InsideTransaction stage, the handler. The
 * place in brackets belongs to doc 16's MCP plan, which adds its step to these lists without changing
 * MiddlewareRunner.
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
        CheckEntry::class,
        ValidateCommand::class,
        AdmitStack::class,
        RecordRefusalReceipt::class,
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
    public const array INSIDE = [AuthorizeCommand::class, RecordReceipt::class];
}
