<?php

declare(strict_types=1);

namespace Domain\Rules\Mcp\Tools;

use App\Mcp\Contracts\Continuations;
use App\Mcp\Contracts\TextFields;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Values\ReadRequest;
use Domain\Rules\Contracts\RuleDetailsResolver;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name(RuleReadTool::NAME)]
#[Description('Read one rule, including a proposal’s reason and what it would replace.')]
final class RuleReadTool extends JournalReadTool
{
    public const string NAME = 'rules_read';

    public const string ID_ARGUMENT = 'rule_id';

    public function __construct(
        private readonly RuleDetailsResolver $rules,
        private readonly Continuations $continuations,
        private readonly TextFields $fields,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return ['rule_id' => $this->recordIdArgument($schema), 'continuation' => $schema->string()];
    }

    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        return $this->recordReadRequest($arguments, self::ID_ARGUMENT);
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $rule = $this->rules->rule($arguments->ulid('rule_id'));
        $text = array_filter(['text' => $rule->text, 'reason' => $rule->reason], is_string(...));

        $card = [
            'rule_id' => $rule->id,
            'number' => $rule->number,
            'state' => $rule->state->value,
            'proposer' => $rule->proposerType === null ? null : [
                'type' => $rule->proposerType->value,
                'id' => $rule->proposerId,
            ],
            'replaces_rule_number' => $rule->replacesRuleNumber,
        ];

        $cursor = $arguments->continuation();

        if ($cursor !== null) {
            $position = $this->continuations->open($cursor, $this->name(), $rule->id);

            return $this->fields->page($card, $text, $position, 'rule_id');
        }

        if (strlen(json_encode($text, JSON_THROW_ON_ERROR)) <= 4000) {
            return ToolResult::ok([...$card, ...$text]);
        }

        $position = $this->fields->start(new Continuation($this->name(), $rule->id, [], 1), $text);

        return $this->fields->page($card, $text, $position, 'rule_id');
    }
}
