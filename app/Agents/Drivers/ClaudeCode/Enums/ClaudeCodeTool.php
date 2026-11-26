<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode\Enums;

use App\Agents\Enums\AccessType;
use App\Exceptions\UnsupportedHook;
use App\Files\Enums\FileOperation;
use App\Profiles\Enums\ResourceType;
use App\Support\Inputs\Values\DriverToolInput;
use App\Values\Operation;
use App\Values\ResourceRequest;

/**
 * The Claude Code tools the adapter knows, and what each one is to the journal.
 */
enum ClaudeCodeTool: string
{
    case Bash = 'Bash';
    case Edit = 'Edit';
    case MultiEdit = 'MultiEdit';
    case Write = 'Write';
    case NotebookEdit = 'NotebookEdit';
    case Read = 'Read';
    case Glob = 'Glob';
    case Grep = 'Grep';
    case LS = 'LS';
    case WebFetch = 'WebFetch';
    case WebSearch = 'WebSearch';
    case TodoWrite = 'TodoWrite';
    case ToolSearch = 'ToolSearch';
    case ListMcpResources = 'ListMcpResourcesTool';
    case ReadMcpResource = 'ReadMcpResourceTool';
    case ReadMcpResourceDirectory = 'ReadMcpResourceDirTool';

    public const string SURFACE = 'claude';

    public const int DECLARATION_REVISION = 1;

    public static function named(string $toolName): self
    {
        return self::tryFrom($toolName) ?? throw UnsupportedHook::forTool('Claude Code', $toolName);
    }

    public function changesFiles(): bool
    {
        return match ($this) {
            self::Edit, self::MultiEdit, self::Write, self::NotebookEdit => true,
            self::Bash, self::Read, self::Glob, self::Grep, self::LS, self::WebFetch, self::WebSearch,
            self::TodoWrite, self::ToolSearch, self::ListMcpResources, self::ReadMcpResource,
            self::ReadMcpResourceDirectory => false,
        };
    }

    /**
     * Whether the tool only keeps the driver's own task list, which reaches no file, network or journal resource.
     */
    public function keepsOwnTaskList(): bool
    {
        return $this === self::TodoWrite;
    }

    /**
     * Whether the tool reads, lists or searches files by the paths its input names.
     */
    public function isFileReader(): bool
    {
        return match ($this) {
            self::Read, self::Glob, self::Grep, self::LS => true,
            self::Bash, self::Edit, self::MultiEdit, self::Write, self::NotebookEdit, self::WebFetch, self::WebSearch,
            self::TodoWrite, self::ToolSearch, self::ListMcpResources, self::ReadMcpResource,
            self::ReadMcpResourceDirectory => false,
        };
    }

    public function fileOperation(): FileOperation
    {
        return match ($this) {
            self::Write => FileOperation::Write,
            default => FileOperation::Edit,
        };
    }

    /**
     * Whether the tool finds or reads MCP tools and resources, which the start limits to the journal's server.
     */
    public function discoversJournalTools(): bool
    {
        return match ($this) {
            self::ToolSearch, self::ListMcpResources, self::ReadMcpResource, self::ReadMcpResourceDirectory => true,
            self::Bash, self::Edit, self::MultiEdit, self::Write, self::NotebookEdit, self::Read,
            self::Glob, self::Grep, self::LS, self::WebFetch, self::WebSearch, self::TodoWrite => false,
        };
    }

    /**
     * Whether the tool names an MCP server or resource address the journal must check.
     */
    public function canReadResources(): bool
    {
        return match ($this) {
            self::ListMcpResources, self::ReadMcpResource, self::ReadMcpResourceDirectory => true,
            self::Bash, self::Edit, self::MultiEdit, self::Write, self::NotebookEdit, self::Read,
            self::Glob, self::Grep, self::LS, self::WebFetch, self::WebSearch, self::TodoWrite,
            self::ToolSearch => false,
        };
    }

    /**
     * The operation a read, search or web call declares: what it needs where. A shell command and a file edit are
     * judged by their own inputs; the journal's discovery tools and the driver's own task list reach no resource.
     */
    public function operation(DriverToolInput $input): Operation
    {
        [$access, $type, $target] = match ($this) {
            self::Read => [
                [AccessType::Read],
                ResourceType::Path,
                $input->firstText('file_path'),
            ],
            self::Glob, self::Grep, self::LS => [
                [AccessType::Search],
                ResourceType::Path,
                $input->textArgument('path') ?? '.',
            ],
            self::WebFetch => [
                [
                    AccessType::Read,
                    AccessType::Network,
                ],
                ResourceType::Destination,
                $input->firstText('url'),
            ],
            self::WebSearch => [
                [
                    AccessType::Read,
                    AccessType::Network,
                ],
                ResourceType::Destination,
                'web search',
            ],
            self::Bash, self::Edit, self::MultiEdit, self::Write, self::NotebookEdit, self::TodoWrite, self::ToolSearch,
            self::ListMcpResources, self::ReadMcpResource, self::ReadMcpResourceDirectory => $this->refuseOperation(),
        };

        return new Operation(
            self::SURFACE,
            sprintf('claude:%s', $this->value),
            $access,
            [new ResourceRequest($type, $target)],
            [$target],
            self::DECLARATION_REVISION,
        );
    }

    /**
     * @throws UnsupportedHook
     */
    private function refuseOperation(): never
    {
        throw UnsupportedHook::notAnOperation('Claude Code', $this->value);
    }
}
