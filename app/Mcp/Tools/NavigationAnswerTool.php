<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Agents\Commands\AnswerNavigation;
use App\Agents\Exceptions\NavigationAnswerRefused;
use App\Agents\Values\NavigationAnswer;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

/**
 * navigation_answer: one round of the main agent on a stalled screen.
 */
#[IsIdempotent]
#[IsDestructive(false)]
#[Name('navigation_answer')]
#[Dispatches(AnswerNavigation::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description(
    'Send one round to a stalled screen, at the version and generation navigation_show gave: exactly one of keys '
    .'(up, down, left, right, enter, esc, tab, space, a digit, y, n), choose (a label), confirm (the label of the '
    .'highlighted entry) or type_parameter (a goal parameter whose value is typed). Confirm a menu entry with choose '
    .'or confirm, never with a raw enter.',
)]
final class NavigationAnswerTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'request' => $schema->string()->max(26)->required(),
            'version' => $schema->integer()->min(1)->required(),
            'generation' => $schema->integer()->min(0)->required(),
            'keys' => $schema->array()->items($schema->string()->max(16)),
            'choose' => $schema->string()->max(200),
            'confirm' => $schema->string()->max(200),
            'type_parameter' => $schema->string()->max(64),
        ];
    }

    protected function command(ToolArguments $arguments): AnswerNavigation
    {
        return new AnswerNavigation(
            $arguments->text('request'),
            $arguments->positiveInteger('version'),
            $arguments->wholeNumber('generation'),
            $this->answerOf($arguments),
        );
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok(['round' => $result->requestId, 'progress' => $result->progress->value], []);
    }

    /**
     * @throws NavigationAnswerRefused
     */
    private function answerOf(ToolArguments $arguments): NavigationAnswer
    {
        $keys = $arguments->list('keys');
        $choose = $arguments->optionalText('choose');
        $confirm = $arguments->optionalText('confirm');
        $parameter = $arguments->optionalText('type_parameter');
        $given = array_filter([$keys !== [], $choose !== null, $confirm !== null, $parameter !== null]);
        if (count($given) !== 1) {
            throw NavigationAnswerRefused::oneAnswer();
        }

        return match (true) {
            $keys !== [] => NavigationAnswer::keys($keys),
            $choose !== null => NavigationAnswer::choose($choose),
            $confirm !== null => NavigationAnswer::confirm($confirm),
            default => NavigationAnswer::typeParameter((string) $parameter),
        };
    }
}
