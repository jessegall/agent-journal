<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Wire;

use App\Processes\Enums\DisclosureStatus;
use App\Processes\Enums\Tone;
use App\Support\Registry;
use App\Web\Enums\Alignment;
use App\Web\Enums\Emphasis;
use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Contracts\Docking\PartField;
use Domain\Chat\Enums\ConsoleStream;
use Domain\Chat\Enums\PartType;
use Domain\Chat\Exceptions\PartMapInvalid;
use Domain\Chat\Support\Cards\Button;
use Domain\Chat\Support\Cards\ConsoleOutput;
use Domain\Chat\Support\Cards\CountedProgress;
use Domain\Chat\Support\Cards\Disclosure;
use Domain\Chat\Support\Cards\Duration;
use Domain\Chat\Support\Cards\Group;
use Domain\Chat\Support\Cards\IndeterminateProgress;
use Domain\Chat\Support\Cards\MessagesExcerpt;
use Domain\Chat\Support\Cards\Row;
use Domain\Chat\Support\Cards\Stack;
use Domain\Chat\Support\Cards\StateLabel;
use Domain\Chat\Support\Cards\Subtitle;
use Domain\Chat\Support\Cards\Title;
use Domain\Chat\Support\Wire\Fields\DestinationField;
use Domain\Chat\Support\Wire\Fields\EnumField;
use Domain\Chat\Support\Wire\Fields\ExcerptField;
use Domain\Chat\Support\Wire\Fields\FlagField;
use Domain\Chat\Support\Wire\Fields\InstantField;
use Domain\Chat\Support\Wire\Fields\LinesField;
use Domain\Chat\Support\Wire\Fields\NumberField;
use Domain\Chat\Support\Wire\Fields\TextField;

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
