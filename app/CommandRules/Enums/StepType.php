<?php

declare(strict_types=1);

namespace App\CommandRules\Enums;

use App\Exceptions\ExecutionPlanRefused;

/**
 * What one step of an execution plan does: run a program, run a shell builtin in its context, control its children
 * (a sequence, an and or or list, a pipeline, a background job, a negation, a group or a subshell), produce a command
 * substitution's output, or run a lowered sh -c source as a child shell.
 */
enum StepType: string
{
    case Command = 'command';
    case Builtin = 'builtin';
    case Sequence = 'sequence';
    case AndList = 'and_list';
    case OrList = 'or_list';
    case Pipeline = 'pipeline';
    case Background = 'background';
    case Negation = 'negation';
    case Group = 'group';
    case Subshell = 'subshell';
    case Substitution = 'substitution';
    case Shell = 'shell';

    /**
     * Whether a syntax node only controls its children, rather than running something itself.
     */
    public static function isControl(NodeType $type): bool
    {
        return in_array(
            $type,
            [
                NodeType::Sequence,
                NodeType::AndList,
                NodeType::OrList,
                NodeType::Pipeline,
                NodeType::Background,
                NodeType::Negation,
                NodeType::Group,
                NodeType::Subshell,
            ],
            true,
        );
    }

    /**
     * The step type of a control node of the syntax tree.
     */
    public static function ofControl(NodeType $type): self
    {
        return match ($type) {
            NodeType::Sequence => self::Sequence,
            NodeType::AndList => self::AndList,
            NodeType::OrList => self::OrList,
            NodeType::Pipeline => self::Pipeline,
            NodeType::Background => self::Background,
            NodeType::Negation => self::Negation,
            NodeType::Group => self::Group,
            NodeType::Subshell => self::Subshell,
            default => throw ExecutionPlanRefused::unsupportedNode($type->value, 0),
        };
    }

    /**
     * Whether each child runs in a copy of the shell context, so a cd or an assignment inside it stays there.
     */
    public function hasSeparateChildContexts(): bool
    {
        return in_array(
            $this,
            [self::Pipeline, self::Background, self::Subshell, self::Substitution, self::Shell],
            true,
        );
    }
}
