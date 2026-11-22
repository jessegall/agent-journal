<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp\Tools;

use App\Contracts\Chat\AgentMessageReader;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name(AgentMessageReader::CONTEXT_TOOL)]
#[Description('Read the message and its ancestors in order, continuing through long bodies with the returned cursor.')]
final class MessageContextTool extends MessageDetailsTool {}
