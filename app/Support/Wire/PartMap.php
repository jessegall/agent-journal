<?php

declare(strict_types=1);

namespace App\Support\Wire;

use App\Docking\Cards\ConsoleOutput;
use App\Exceptions\PartMapInvalid;
use App\Processes\Cards\Duration;
use App\Processes\Cards\StateLabel;
use App\Processes\Enums\ConsoleStream;
use App\Processes\Enums\DisclosureStatus;
use App\Processes\Enums\PartType;
use App\Processes\Enums\Tone;
use App\Support\Cards\Button;
use App\Support\Cards\Contracts\DockPart;
use App\Support\Cards\CountedProgress;
use App\Support\Cards\Disclosure;
use App\Support\Cards\Group;
use App\Support\Cards\IndeterminateProgress;
use App\Support\Cards\MessagesExcerpt;
use App\Support\Cards\Row;
use App\Support\Cards\Stack;
use App\Support\Cards\Subtitle;
use App\Support\Cards\Title;
use App\Support\Registry;
use App\Support\Wire\Contracts\PartField;
use App\Support\Wire\Fields\DestinationField;
use App\Support\Wire\Fields\EnumField;
use App\Support\Wire\Fields\ExcerptField;
use App\Support\Wire\Fields\FlagField;
use App\Support\Wire\Fields\InstantField;
use App\Support\Wire\Fields\LinesField;
use App\Support\Wire\Fields\NumberField;
use App\Support\Wire\Fields\TextField;
use App\Web\Enums\Alignment;
use App\Web\Enums\Emphasis;

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
            EnumField::named('initial', DisclosureStatus::class),
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
            FlagField::named('isTruncated'),
            $openField,
        );

        $map->part(
            MessagesExcerpt::class,
            PartType::MessagesExcerpt,
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
