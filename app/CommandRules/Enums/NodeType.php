<?php

declare(strict_types=1);

namespace App\CommandRules\Enums;

use App\Processes\Enums\PartJoin;

/**
 * What one node of a shell syntax tree is.
 */
enum NodeType: string
{
    case SimpleCommand = 'simple_command';
    case Pipeline = 'pipeline';
    case AndList = 'and_list';
    case OrList = 'or_list';
    case Sequence = 'sequence';
    case Background = 'background';
    case Negation = 'negation';
    case Group = 'group';
    case Subshell = 'subshell';
    case CommandSubstitution = 'command_substitution';
    case ProcessSubstitution = 'process_substitution';
    case Redirect = 'redirect';
    case Assignment = 'assignment';
    case HereDocument = 'here_document';
    case Comment = 'comment';
    case Unsupported = 'unsupported';

    /**
     * Whether the node is a command the shell runs, as opposed to a structure that joins or wraps commands.
     */
    public function isExecutable(): bool
    {
        return $this === self::SimpleCommand;
    }

    /**
     * How a list of this type joins one of its commands to the next; a node that only wraps commands joins none.
     */
    public function partJoin(): PartJoin|null
    {
        return match ($this) {
            self::Pipeline => PartJoin::Pipe,
            self::AndList => PartJoin::And,
            self::OrList => PartJoin::Or,
            self::Sequence, self::Background => PartJoin::Sequence,
            self::SimpleCommand, self::Negation, self::Group, self::Subshell, self::CommandSubstitution,
            self::ProcessSubstitution, self::Redirect, self::Assignment, self::HereDocument, self::Comment,
            self::Unsupported => null,
        };
    }
}
