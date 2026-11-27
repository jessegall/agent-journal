<?php

declare(strict_types=1);

namespace App\CommandRules\Declarations;

use App\CommandRules\Enums\BindingType;
use App\CommandRules\Enums\CommandClass;
use App\CommandRules\Enums\CommandType;
use App\CommandRules\Enums\EmptyPolicy;
use App\CommandRules\Enums\EmptySelection;
use App\CommandRules\Enums\ExampleType;
use App\CommandRules\Enums\FramingType;
use App\CommandRules\Enums\OperandType;
use App\CommandRules\Enums\Outcome;
use App\CommandRules\Enums\OutputEncoding;
use App\CommandRules\Enums\OutputRequirement;
use App\CommandRules\Enums\ProgressType;
use App\CommandRules\Enums\ScopeType;
use App\CommandRules\Enums\StreamUse;
use App\CommandRules\Enums\SummaryRule;
use App\CommandRules\Enums\ToolType;
use App\CommandRules\Exceptions\DeclarationInvalid;
use App\CommandRules\Values\DeclaredProposal;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Validation\Rule;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * Reads the text of a declaration file into typed proposals at the boundary: every
 * field is checked against its type and closed set first, and a broken file is refused naming each wrong field, so no
 * untyped array reaches Core.
 */
final readonly class RuleDeclarations
{
    private const string RULE_ID = 'regex:/^[a-z0-9-]+(\.[a-z0-9-]+)+$/';

    private const string ONE_DECLARATION_REQUIRED = 'a proposal sends exactly one declaration';

    public function __construct(private Factory $validators) {}

    /**
     * @return list<DeclaredProposal>
     *
     * @throws DeclarationInvalid
     */
    public function read(string $text): array
    {
        try {
            $file = DeclarationFileText::from(json_decode($text, true, flags: JSON_THROW_ON_ERROR));
        } catch (JsonException $broken) {
            throw DeclarationInvalid::notJson($broken);
        } catch (CannotCreateData|TypeError) {
            return $this->readFile([]);
        }

        return $this->readFile(['declarations' => $file->declarations]);
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
     * The one declaration of a declaration file sent as its JSON text for a held command request.
     *
     * @throws DeclarationInvalid
     */
    public function readSentFile(string $text): DeclaredProposal
    {
        $declared = $this->read($text);

        if (count($declared) !== 1) {
            throw DeclarationInvalid::fields([self::ONE_DECLARATION_REQUIRED]);
        }

        return $declared[0];
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
            'declarations' => [
                'required',
                'array',
                'list',
            ],
            "{$each}.request_id" => [
                'required',
                'string',
                'max:255',
            ],
            "{$each}.evidence" => [
                'present',
                'string',
            ],
            "{$each}.examples" => [
                'present',
                'array',
                'list',
            ],
            "{$each}.examples.*.type" => [
                'required',
                Rule::enum(ExampleType::class),
            ],
            "{$each}.examples.*.line" => [
                'required',
                'string',
            ],
            "{$each}.examples.*.classes" => [
                'required',
                'array',
            ],
            "{$each}.examples.*.classes.classes" => [
                'present',
                'array',
                'list',
            ],
            "{$each}.examples.*.classes.classes.*" => [Rule::enum(CommandClass::class)],
            ...$this->ruleFields("{$each}.rule"),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function ruleFields(string $rule): array
    {
        $operandType = Rule::enum(OperandType::class);

        return [
            "{$rule}.id" => [
                'required',
                'string',
                self::RULE_ID,
            ],
            ...$this->scopeFields("{$rule}.scope"),
            "{$rule}.program.family" => [
                'required',
                'string',
            ],
            "{$rule}.program.spellings" => [
                'present',
                'array',
                'list',
            ],
            "{$rule}.program.spellings.*" => ['string'],
            "{$rule}.subcommands" => [
                'present',
                'array',
                'list',
            ],
            "{$rule}.subcommands.*" => ['string'],
            "{$rule}.arguments.options" => [
                'present',
                'array',
                'list',
            ],
            "{$rule}.arguments.options.*.names" => [
                'required',
                'array',
                'list',
                'min:1',
            ],
            "{$rule}.arguments.options.*.names.*" => ['string'],
            "{$rule}.arguments.options.*.value" => [
                'present',
                'array',
                'list',
                'max:1',
            ],
            "{$rule}.arguments.options.*.value.*" => [$operandType],
            "{$rule}.arguments.options.*.required" => [
                'required',
                'boolean',
            ],
            "{$rule}.arguments.operands" => [
                'present',
                'array',
                'list',
            ],
            "{$rule}.arguments.operands.*" => [$operandType],
            "{$rule}.arguments.repeats_last_operand" => [
                'required',
                'boolean',
            ],
            "{$rule}.arguments.ends_options_at_double_dash" => [
                'required',
                'boolean',
            ],
            "{$rule}.arguments.accepts_numeric_options" => [
                'required',
                'boolean',
            ],
            "{$rule}.arguments.minimum_operands" => [
                'required',
                'integer',
                'min:0',
            ],
            "{$rule}.classes" => [
                'required',
                'array',
            ],
            "{$rule}.classes.classes" => [
                'present',
                'array',
                'list',
            ],
            "{$rule}.classes.classes.*" => [Rule::enum(CommandClass::class)],
            "{$rule}.purpose" => [
                'required',
                Rule::enum(CommandType::class),
            ],
            "{$rule}.output_requirement" => [
                'required',
                Rule::enum(OutputRequirement::class),
            ],
            ...$this->bindingFields("{$rule}.binding"),
            "{$rule}.revision" => [
                'required',
                'integer',
                'min:1',
            ],
            "{$rule}.replaces" => [
                'present',
                'array',
                'list',
                'max:1',
            ],
            ...$this->scopeFields("{$rule}.replaces.*.scope"),
            "{$rule}.replaces.*.id" => [
                'required',
                'string',
                self::RULE_ID,
            ],
            "{$rule}.replaces.*.revision" => [
                'required',
                'integer',
                'min:1',
            ],
            "{$rule}.contracts" => [
                'present',
                'array',
                'list',
                'max:1',
            ],
            ...$this->contractFields("{$rule}.contracts.*"),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function scopeFields(string $scope): array
    {
        return [
            "{$scope}.type" => [
                'required',
                Rule::enum(ScopeType::class),
            ],
            "{$scope}.owner" => [
                'required',
                'string',
            ],
            "{$scope}.version" => [
                'present',
                'string',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function bindingFields(string $binding): array
    {
        return [
            "{$binding}.type" => [
                'required',
                Rule::enum(BindingType::class),
            ],
            "{$binding}.family" => [
                'required',
                'string',
            ],
            "{$binding}.locations" => [
                'present',
                'array',
                'list',
            ],
            "{$binding}.locations.*" => ['string'],
            "{$binding}.content_digest" => [
                'present',
                'nullable',
                'string',
            ],
            "{$binding}.configuration_revision" => [
                'required',
                'integer',
                'min:0',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function contractFields(string $contract): array
    {
        return [
            "{$contract}.operation" => [
                'required',
                'string',
            ],
            "{$contract}.tool" => [
                'required',
                Rule::enum(ToolType::class),
            ],
            ...$this->bindingFields("{$contract}.binding"),
            "{$contract}.output.encoding" => [
                'required',
                Rule::enum(OutputEncoding::class),
            ],
            "{$contract}.output.framing" => [
                'required',
                Rule::enum(FramingType::class),
            ],
            "{$contract}.output.schema_versions" => [
                'required',
                'string',
            ],
            "{$contract}.output.streams" => [
                'required',
                Rule::enum(StreamUse::class),
            ],
            "{$contract}.output.summary" => [
                'required',
                Rule::enum(SummaryRule::class),
            ],
            "{$contract}.output.empty.policy" => [
                'required',
                Rule::enum(EmptyPolicy::class),
            ],
            "{$contract}.output.empty.summary" => [
                'present',
                'string',
            ],
            "{$contract}.output.empty_selection" => [
                'required',
                Rule::enum(EmptySelection::class),
            ],
            "{$contract}.exits" => [
                'required',
                'array',
            ],
            "{$contract}.exits.branches" => [
                'present',
                'array',
                'list',
            ],
            "{$contract}.exits.branches.*.status" => [
                'required',
                'integer',
                'between:0,255',
                'distinct',
            ],
            "{$contract}.exits.branches.*.outcome" => [
                'required',
                Rule::enum(Outcome::class),
            ],
            "{$contract}.exits.branches.*.requires" => [
                'required',
                'string',
            ],
            "{$contract}.progress.type" => [
                'required',
                Rule::enum(ProgressType::class),
            ],
            "{$contract}.progress.listing" => [
                'present',
                'array',
                'list',
                'max:1',
            ],
            "{$contract}.progress.listing.*" => ['string'],
            "{$contract}.progress.selection_fingerprint" => [
                'present',
                'string',
            ],
            "{$contract}.reader" => [
                'required',
                'array',
            ],
            "{$contract}.reader.revision" => [
                'present',
                'string',
            ],
        ];
    }
}
