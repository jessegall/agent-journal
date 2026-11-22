<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Mcp;

use App\Contracts\AgentMessageReader;
use App\Mcp\Contracts\SearchContribution;
use App\Mcp\Data\SearchPage;
use App\Values\ReadRequest;

final readonly class MessageSearch implements SearchContribution
{
    public function __construct(private AgentMessageReader $messages) {}

    public function recordType(): string
    {
        return AgentMessageReader::SEARCH_TYPE;
    }

    public function readRequest(): ReadRequest
    {
        return new ReadRequest('messages_read');
    }

    public function search(string $query, int $page): SearchPage
    {
        return $this->messages->search($query, $page);
    }
}
