<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\CommandMiddleware\CheckActor;
use App\Bus\CommandMiddleware\LogCommand;
use App\Bus\CommandMiddleware\RunInTransaction;
use App\Bus\Contracts\CommandMiddleware;

/**
 * The order every command passes (doc 19, section 6.5): LogCommand, CheckActor, [stack admission], the module
 * middleware of the BeforeTransaction stage, RunInTransaction, [receipt check], [guard], the module middleware of the
 * InsideTransaction stage, the handler, [receipt write]. The places in brackets belong to doc 16's MCP plan, which
 * adds its steps to these lists without changing MiddlewareRunner.
 */
final class CommandFrame
{
    /**
     * The Core steps before the module middleware of the BeforeTransaction stage.
     *
     * @var list<class-string<CommandMiddleware>>
     */
    public const array FIRST = [LogCommand::class, CheckActor::class];

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
    public const array INSIDE = [];
}
