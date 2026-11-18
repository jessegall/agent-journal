<?php

declare(strict_types=1);

use App\Http\Middleware\Mcp\LimitMcpMessage;
use App\Mcp\Servers\JournalServer;
use Laravel\Mcp\Facades\Mcp;

Mcp::web('/agent/mcp/v1', JournalServer::class)
    ->middleware(['journal.agent', LimitMcpMessage::class, 'throttle:journal-mcp'])
    ->name('mcp.journal');
