<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class PhaseReaderDataFields
{
    private string $planNumber;

    private string $planTitle;

    private string $number;

    private string $title;

    private int $finishedTasks;

    private int $cancelledTasks;

    private int $totalTasks;

    private bool $isCurrent;

    private bool $canRunChecks;

    private PhaseTaskPageData $tasks;

    private PhaseCheckData|Optional $checkReceipt;

    public function __construct()
    {
        $this->checkReceipt = new Optional();
    }

    public function planNumber(string $planNumber): self
    {
        $this->planNumber = $planNumber;

        return $this;
    }

    public function planTitle(string $planTitle): self
    {
        $this->planTitle = $planTitle;

        return $this;
    }

    public function number(string $number): self
    {
        $this->number = $number;

        return $this;
    }

    public function title(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function finishedTasks(int $finishedTasks): self
    {
        $this->finishedTasks = $finishedTasks;

        return $this;
    }

    public function cancelledTasks(int $cancelledTasks): self
    {
        $this->cancelledTasks = $cancelledTasks;

        return $this;
    }

    public function totalTasks(int $totalTasks): self
    {
        $this->totalTasks = $totalTasks;

        return $this;
    }

    public function isCurrent(bool $isCurrent): self
    {
        $this->isCurrent = $isCurrent;

        return $this;
    }

    public function canRunChecks(bool $canRunChecks): self
    {
        $this->canRunChecks = $canRunChecks;

        return $this;
    }

    public function tasks(PhaseTaskPageData $tasks): self
    {
        $this->tasks = $tasks;

        return $this;
    }

    public function checkReceipt(PhaseCheckData|Optional $checkReceipt): self
    {
        $this->checkReceipt = $checkReceipt;

        return $this;
    }

    public function finish(): PhaseReaderData
    {
        if (! isset($this->planNumber)) {
            throw MissingFields::forType(PhaseReaderData::class, 'planNumber');
        }

        if (! isset($this->planTitle)) {
            throw MissingFields::forType(PhaseReaderData::class, 'planTitle');
        }

        if (! isset($this->number)) {
            throw MissingFields::forType(PhaseReaderData::class, 'number');
        }

        if (! isset($this->title)) {
            throw MissingFields::forType(PhaseReaderData::class, 'title');
        }

        if (! isset($this->finishedTasks)) {
            throw MissingFields::forType(PhaseReaderData::class, 'finishedTasks');
        }

        if (! isset($this->cancelledTasks)) {
            throw MissingFields::forType(PhaseReaderData::class, 'cancelledTasks');
        }

        if (! isset($this->totalTasks)) {
            throw MissingFields::forType(PhaseReaderData::class, 'totalTasks');
        }

        if (! isset($this->isCurrent)) {
            throw MissingFields::forType(PhaseReaderData::class, 'isCurrent');
        }

        if (! isset($this->canRunChecks)) {
            throw MissingFields::forType(PhaseReaderData::class, 'canRunChecks');
        }

        if (! isset($this->tasks)) {
            throw MissingFields::forType(PhaseReaderData::class, 'tasks');
        }

        return new PhaseReaderData(
            planNumber: $this->planNumber,
            planTitle: $this->planTitle,
            number: $this->number,
            title: $this->title,
            finishedTasks: $this->finishedTasks,
            cancelledTasks: $this->cancelledTasks,
            totalTasks: $this->totalTasks,
            isCurrent: $this->isCurrent,
            canRunChecks: $this->canRunChecks,
            tasks: $this->tasks,
            checkReceipt: $this->checkReceipt,
        );
    }
}
