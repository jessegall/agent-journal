<?php

declare(strict_types=1);

namespace App\Processes\Declarations;

use App\Processes\Enums\BindingType;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\EmptyPolicy;
use App\Processes\Enums\EmptySelection;
use App\Processes\Enums\ExampleType;
use App\Processes\Enums\FramingType;
use App\Processes\Enums\OperandType;
use App\Processes\Enums\Outcome;
use App\Processes\Enums\OutputEncoding;
use App\Processes\Enums\OutputRequirement;
use App\Processes\Enums\ProgressType;
use App\Processes\Enums\ScopeType;
use App\Processes\Enums\StreamUse;
use App\Processes\Enums\SummaryRule;
use App\Processes\Enums\ToolType;
use App\Processes\Exceptions\DeclarationInvalid;
use App\Processes\Values\DeclaredProposal;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Validation\Rule;
use JsonException;

/**
 * Reads the text of a declaration file into typed proposals at the boundary (doc 21 revision 6, section 51): every
 * field is checked against its type and closed set first, and a broken file is refused naming each wrong field, so no
 * untyped array reaches Core.
 */
final readonly class RuleDeclarations
{
    private const string RULE_ID = 'regex:/^[a-z0-9-]+(\.[a-z0-9-]+)+$/';

    public function __construct(private Factory $validators) {}

    /**
     * @return list<DeclaredProposal>
     *
     * @throws DeclarationInvalid
     */
    public function read(string $text): array
    {
        try {
            $file = json_decode($text, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $broken) {
            throw DeclarationInvalid::notJson($broken);
        }

        return $this->readFile(is_array($file) ? $file : []);
    }

    /**
     * One declaration sent on its own, as a propose or revise call sends it: request id, evidence, examples and rule.
     *
     * @param  array<string, mixed>  $declaration
     *
     * @throws DeclarationInvalid
     */
    public function readOne(array $declaration): DeclaredProposal
    {
        return $this->readFile(['declarations' => [$declaration]])[0];
    }

    /**
     * @param  array<mixed>  $file
     * @return list<DeclaredProposal>
     *
     * @throws DeclarationInvalid
     */
    private function readFile(array $file): array
    {
        $validator = $this->validators->make($file, $this->rules());
        if ($validator->fails()) {
            throw DeclarationInvalid::fields(
                $this->fieldErrors(array_map(array_values(...), $validator->errors()->messages())),
            );
        }
        $declared = RuleDeclarationFile::from($validator->validated())->toProposals();
        $this->checkPurposes($declared);

        return $declared;
    }

    /**
     * A test, check or build carries exactly one contract and any other purpose none, as its purpose requires.
     *
     * @param  list<DeclaredProposal>  $declared
     *
     * @throws DeclarationInvalid
     */
    private function checkPurposes(array $declared): void
    {
        $wrong = [];
        foreach ($declared as $index => $declaration) {
            $rule = $declaration->proposed->rule;
            if ($rule->outputRequirement !== $rule->purpose->outputRequirement()) {
                $wrong[] = "declarations.{$index}.rule.output_requirement: it does not match the purpose";
            }
            if (count($rule->contracts) !== ($rule->hasContract() ? 1 : 0)) {
                $wrong[] = "declarations.{$index}.rule.contracts: one for a test, check or build, none otherwise";
            }
        }
        if ($wrong !== []) {
            throw DeclarationInvalid::fields($wrong);
        }
    }

    /**
     * @param  array<string, list<string>>  $messages
     * @return list<string>
     */
    private function fieldErrors(array $messages): array
    {
        $errors = [];
        foreach ($messages as $field => $lines) {
            $errors[] = "{$field}: ".implode(' ', $lines);
        }

        return $errors;
    }

    /**
     * @return array<string, mixed>
     */
    private function rules(): array
    {
        $each = 'declarations.*';

        return [
            'declarations' => ['required', 'array', 'list'],
            "{$each}.request_id" => ['required', 'string', 'max:255'],
            "{$each}.evidence" => ['present', 'string'],
            "{$each}.examples" => ['present', 'array', 'list'],
            "{$each}.examples.*.type" => ['required', Rule::enum(ExampleType::class)],
            "{$each}.examples.*.line" => ['required', 'string'],
            "{$each}.examples.*.classes" => ['present', 'array', 'list'],
            "{$each}.examples.*.classes.*" => [Rule::enum(CommandClass::class)],
            ...$this->ruleFields("{$each}.rule"),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function ruleFields(string $rule): array
    {
        return [
            "{$rule}.id" => ['required', 'string', self::RULE_ID],
            ...$this->scopeFields("{$rule}.scope"),
            "{$rule}.program.family" => ['required', 'string'],
            "{$rule}.program.spellings" => ['present', 'array', 'list'],
            "{$rule}.program.spellings.*" => ['string'],
            "{$rule}.subcommands" => ['present', 'array', 'list'],
            "{$rule}.subcommands.*" => ['string'],
            "{$rule}.arguments.options" => ['present', 'array', 'list'],
            "{$rule}.arguments.options.*.names" => ['required', 'array', 'list', 'min:1'],
            "{$rule}.arguments.options.*.names.*" => ['string'],
            "{$rule}.arguments.options.*.value" => ['present', 'array', 'list', 'max:1'],
            "{$rule}.arguments.options.*.value.*" => [Rule::enum(OperandType::class)],
            "{$rule}.arguments.options.*.required" => ['required', 'boolean'],
            "{$rule}.arguments.operands" => ['present', 'array', 'list'],
            "{$rule}.arguments.operands.*" => [Rule::enum(OperandType::class)],
            "{$rule}.arguments.repeats_last_operand" => ['required', 'boolean'],
            "{$rule}.arguments.ends_options_at_double_dash" => ['required', 'boolean'],
            "{$rule}.arguments.accepts_numeric_options" => ['required', 'boolean'],
            "{$rule}.arguments.minimum_operands" => ['required', 'integer', 'min:0'],
            "{$rule}.classes" => ['present', 'array', 'list'],
            "{$rule}.classes.*" => [Rule::enum(CommandClass::class)],
            "{$rule}.purpose" => ['required', Rule::enum(CommandType::class)],
            "{$rule}.output_requirement" => ['required', Rule::enum(OutputRequirement::class)],
            ...$this->bindingFields("{$rule}.binding"),
            "{$rule}.revision" => ['required', 'integer', 'min:1'],
            "{$rule}.replaces" => ['present', 'array', 'list', 'max:1'],
            ...$this->scopeFields("{$rule}.replaces.*.scope"),
            "{$rule}.replaces.*.id" => ['required', 'string', self::RULE_ID],
            "{$rule}.replaces.*.revision" => ['required', 'integer', 'min:1'],
            "{$rule}.contracts" => ['present', 'array', 'list', 'max:1'],
            ...$this->contractFields("{$rule}.contracts.*"),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function scopeFields(string $scope): array
    {
        return [
            "{$scope}.type" => ['required', Rule::enum(ScopeType::class)],
            "{$scope}.owner" => ['required', 'string'],
            "{$scope}.version" => ['present', 'string'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function bindingFields(string $binding): array
    {
        return [
            "{$binding}.type" => ['required', Rule::enum(BindingType::class)],
            "{$binding}.family" => ['required', 'string'],
            "{$binding}.locations" => ['present', 'array', 'list'],
            "{$binding}.locations.*" => ['string'],
            "{$binding}.content_digest" => ['present', 'string'],
            "{$binding}.configuration_revision" => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function contractFields(string $contract): array
    {
        return [
            "{$contract}.operation" => ['required', 'string'],
            "{$contract}.tool" => ['required', Rule::enum(ToolType::class)],
            ...$this->bindingFields("{$contract}.binding"),
            "{$contract}.output.encoding" => ['required', Rule::enum(OutputEncoding::class)],
            "{$contract}.output.framing" => ['required', Rule::enum(FramingType::class)],
            "{$contract}.output.schema_versions" => ['required', 'string'],
            "{$contract}.output.streams" => ['required', Rule::enum(StreamUse::class)],
            "{$contract}.output.summary" => ['required', Rule::enum(SummaryRule::class)],
            "{$contract}.output.empty.policy" => ['required', Rule::enum(EmptyPolicy::class)],
            "{$contract}.output.empty.summary" => ['present', 'string'],
            "{$contract}.output.empty_selection" => ['required', Rule::enum(EmptySelection::class)],
            "{$contract}.exits" => ['present', 'array', 'list'],
            "{$contract}.exits.*.status" => ['required', 'integer', 'between:0,255', 'distinct'],
            "{$contract}.exits.*.outcome" => ['required', Rule::enum(Outcome::class)],
            "{$contract}.exits.*.requires" => ['required', 'string'],
            "{$contract}.progress.type" => ['required', Rule::enum(ProgressType::class)],
            "{$contract}.progress.listing" => ['present', 'array', 'list', 'max:1'],
            "{$contract}.progress.listing.*" => ['string'],
            "{$contract}.progress.selection_fingerprint" => ['present', 'string'],
            "{$contract}.reader" => ['present', 'string'],
        ];
    }
}
