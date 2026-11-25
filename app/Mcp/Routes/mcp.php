<?php

declare(strict_types=1);

use App\Http\Middleware\Mcp\LimitMcpMessage;
use App\Http\Middleware\Mcp\SetCallDeadline;
use App\Mcp\Servers\JournalServer;
use Laravel\Mcp\Facades\Mcp;

Mcp::web(JournalServer::PATH, JournalServer::class)
    ->middleware([
        'journal.agent',
        LimitMcpMessage::class,
        SetCallDeadline::class,
        'throttle:journal-mcp',
    ])
    ->name('mcp.journal');
