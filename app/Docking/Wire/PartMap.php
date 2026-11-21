<?php

declare(strict_types=1);

namespace App\Docking\Wire;

use App\Docking\Cards\Button;
use App\Docking\Cards\ChatExcerpt;
use App\Docking\Cards\ConsoleOutput;
use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Cards\CountedProgress;
use App\Docking\Cards\Disclosure;
use App\Docking\Cards\Duration;
use App\Docking\Cards\Group;
use App\Docking\Cards\IndeterminateProgress;
use App\Docking\Cards\Row;
use App\Docking\Cards\Stack;
use App\Docking\Cards\StateLabel;
use App\Docking\Cards\Subtitle;
use App\Docking\Cards\Title;
use App\Docking\Enums\Alignment;
use App\Docking\Enums\ConsoleStream;
use App\Docking\Enums\DisclosureState;
use App\Docking\Enums\Emphasis;
use App\Docking\Enums\PartType;
use App\Docking\Enums\Tone;
use App\Docking\Exceptions\PartMapInvalid;
use App\Docking\Wire\Contracts\PartField;
use App\Docking\Wire\Fields\DestinationField;
use App\Docking\Wire\Fields\EnumField;
use App\Docking\Wire\Fields\ExcerptField;
use App\Docking\Wire\Fields\FlagField;
use App\Docking\Wire\Fields\InstantField;
use App\Docking\Wire\Fields\LinesField;
use App\Docking\Wire\Fields\NumberField;
use App\Docking\Wire\Fields\TextField;
use App\Registries\Support\Registry;

/**
 * The one map from each part class to the literal type it is written as and its fields, read by the encoder and by
 * the TypeScript generator alike. Every part is mapped once; no owner adds one.
 */
final class PartMap
{
    /**
     * @var Registry<PartDescriptor>
     */
    private readonly Registry $descriptors;

    /**
     * @var Registry<PartDescriptor>
     */
    private readonly Registry $byType;

    public function __construct()
    {
        $this->descriptors = Registry::once(PartMapInvalid::unmappedClass(...), PartMapInvalid::repeatedClass(...));
        $this->byType = Registry::once(PartMapInvalid::unmappedType(...), PartMapInvalid::repeatedType(...));
    }

    public static function standard(): self
    {
        $openField = DestinationField::named('open');
        $labelField = TextField::named('label');
        $textField = TextField::named('text');

        $map = new self();
        $map->part(Stack::class, PartType::Stack);
        $map->part(Row::class, PartType::Row, EnumField::named('alignment', Alignment::class));
        $map->part(Group::class, PartType::Group, $labelField);

        $map->part(
            Disclosure::class,
            PartType::Disclosure,
            TextField::named('title'),
            EnumField::named('initial', DisclosureState::class),
        );

        $map->part(Title::class, PartType::Title, $textField);
        $map->part(Subtitle::class, PartType::Subtitle, $textField);

        $map->part(
            StateLabel::class,
            PartType::StateLabel,
            $textField,
            EnumField::named('tone', Tone::class),
        );

        $map->part(
            CountedProgress::class,
            PartType::CountedProgress,
            NumberField::named('completed'),
            NumberField::named('total'),
        );

        $map->part(IndeterminateProgress::class, PartType::IndeterminateProgress, $labelField);

        $map->part(
            Duration::class,
            PartType::Duration,
            InstantField::named('startedAt'),
            InstantField::optional('finishedAt'),
        );

        $map->part(
            ConsoleOutput::class,
            PartType::ConsoleOutput,
            EnumField::named('stream', ConsoleStream::class),
            LinesField::named('lines'),
            FlagField::named('truncated'),
            $openField,
        );

        $map->part(
            ChatExcerpt::class,
            PartType::ChatExcerpt,
            ExcerptField::named('messages'),
            $openField,
        );

        $map->part(
            Button::class,
            PartType::Button,
            $labelField,
            EnumField::named('emphasis', Emphasis::class),
            DestinationField::named('target'),
        );

        $map->assertEveryTypeMapped();

        return $map;
    }

    /**
     * @param  class-string<DockPart>  $class
     */
    public function part(string $class, PartType $type, PartField ...$fields): void
    {
        $descriptor = new PartDescriptor($class, $type, array_values($fields));
        $this->byType->put($type->value, $descriptor);
        $this->descriptors->put($class, $descriptor);
    }

    public function descriptorOf(DockPart $part): PartDescriptor
    {
        return $this->descriptors->get($part::class);
    }

    /**
     * @return list<PartDescriptor>
     */
    public function descriptors(): array
    {
        return array_values($this->descriptors->all());
    }

    public function assertEveryTypeMapped(): void
    {
        foreach (PartType::cases() as $type) {
            if (! $this->byType->has($type->value)) {
                throw PartMapInvalid::unmappedType($type->value);
            }
        }
    }
}
