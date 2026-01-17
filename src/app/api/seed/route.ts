import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Check if data already exists
    const existingContracts = await prisma.contract.count()
    if (existingContracts > 0) {
      return NextResponse.json(
        { message: 'Database already seeded. Delete existing data first if you want to reseed.' },
        { status: 400 }
      )
    }

    // Create sample blueprints
    const employmentBlueprint = await prisma.blueprint.create({
      data: {
        name: 'Employment Contract',
        description: 'Standard employment agreement template',
        fields: {
          create: [
            {
              type: 'TEXT',
              label: 'Employee Name',
              positionX: 0,
              positionY: 0,
              required: true,
            },
            {
              type: 'TEXT',
              label: 'Job Title',
              positionX: 0,
              positionY: 1,
              required: true,
            },
            {
              type: 'DATE',
              label: 'Start Date',
              positionX: 0,
              positionY: 2,
              required: true,
            },
            {
              type: 'TEXT',
              label: 'Salary',
              positionX: 0,
              positionY: 3,
              required: true,
            },
            {
              type: 'CHECKBOX',
              label: 'I agree to the terms and conditions',
              positionX: 0,
              positionY: 4,
              required: true,
            },
          ],
        },
      },
      include: { fields: true },
    })

    const ndaBlueprint = await prisma.blueprint.create({
      data: {
        name: 'Non-Disclosure Agreement',
        description: 'Standard NDA template',
        fields: {
          create: [
            {
              type: 'TEXT',
              label: 'Party Name',
              positionX: 0,
              positionY: 0,
              required: true,
            },
            {
              type: 'TEXT',
              label: 'Company Name',
              positionX: 0,
              positionY: 1,
              required: true,
            },
            {
              type: 'DATE',
              label: 'Effective Date',
              positionX: 0,
              positionY: 2,
              required: true,
            },
            {
              type: 'DATE',
              label: 'Expiration Date',
              positionX: 0,
              positionY: 3,
              required: true,
            },
            {
              type: 'SIGNATURE',
              label: 'Signature',
              positionX: 0,
              positionY: 4,
              required: true,
            },
          ],
        },
      },
      include: { fields: true },
    })

    const serviceBlueprint = await prisma.blueprint.create({
      data: {
        name: 'Service Agreement',
        description: 'Service provider agreement template',
        fields: {
          create: [
            {
              type: 'TEXT',
              label: 'Service Provider Name',
              positionX: 0,
              positionY: 0,
              required: true,
            },
            {
              type: 'TEXT',
              label: 'Client Name',
              positionX: 0,
              positionY: 1,
              required: true,
            },
            {
              type: 'TEXT',
              label: 'Service Description',
              positionX: 0,
              positionY: 2,
              required: true,
            },
            {
              type: 'TEXT',
              label: 'Contract Value',
              positionX: 0,
              positionY: 3,
              required: true,
            },
            {
              type: 'DATE',
              label: 'Contract Start Date',
              positionX: 0,
              positionY: 4,
              required: true,
            },
            {
              type: 'DATE',
              label: 'Contract End Date',
              positionX: 0,
              positionY: 5,
              required: true,
            },
          ],
        },
      },
      include: { fields: true },
    })

    // Create sample contracts
    await prisma.contract.create({
      data: {
        name: 'Employment Contract - John Doe',
        blueprintId: employmentBlueprint.id,
        status: 'CREATED',
        fields: {
          create: [
            {
              fieldId: employmentBlueprint.fields[0].id,
              value: JSON.stringify('John Doe'),
            },
            {
              fieldId: employmentBlueprint.fields[1].id,
              value: JSON.stringify('Senior Software Engineer'),
            },
            {
              fieldId: employmentBlueprint.fields[2].id,
              value: JSON.stringify('2024-01-15'),
            },
            {
              fieldId: employmentBlueprint.fields[3].id,
              value: JSON.stringify('$120,000'),
            },
            {
              fieldId: employmentBlueprint.fields[4].id,
              value: JSON.stringify(true),
            },
          ],
        },
      },
    })

    await prisma.contract.create({
      data: {
        name: 'Employment Contract - Jane Smith',
        blueprintId: employmentBlueprint.id,
        status: 'APPROVED',
        fields: {
          create: [
            {
              fieldId: employmentBlueprint.fields[0].id,
              value: JSON.stringify('Jane Smith'),
            },
            {
              fieldId: employmentBlueprint.fields[1].id,
              value: JSON.stringify('Product Manager'),
            },
            {
              fieldId: employmentBlueprint.fields[2].id,
              value: JSON.stringify('2024-02-01'),
            },
            {
              fieldId: employmentBlueprint.fields[3].id,
              value: JSON.stringify('$100,000'),
            },
            {
              fieldId: employmentBlueprint.fields[4].id,
              value: JSON.stringify(true),
            },
          ],
        },
      },
    })

    await prisma.contract.create({
      data: {
        name: 'NDA - Acme Corp',
        blueprintId: ndaBlueprint.id,
        status: 'SENT',
        fields: {
          create: [
            {
              fieldId: ndaBlueprint.fields[0].id,
              value: JSON.stringify('Acme Corporation'),
            },
            {
              fieldId: ndaBlueprint.fields[1].id,
              value: JSON.stringify('Tech Solutions Inc'),
            },
            {
              fieldId: ndaBlueprint.fields[2].id,
              value: JSON.stringify('2024-01-01'),
            },
            {
              fieldId: ndaBlueprint.fields[3].id,
              value: JSON.stringify('2025-01-01'),
            },
            {
              fieldId: ndaBlueprint.fields[4].id,
              value: JSON.stringify('John Doe'),
            },
          ],
        },
      },
    })

    await prisma.contract.create({
      data: {
        name: 'Service Agreement - Web Development',
        blueprintId: serviceBlueprint.id,
        status: 'SIGNED',
        fields: {
          create: [
            {
              fieldId: serviceBlueprint.fields[0].id,
              value: JSON.stringify('WebDev Solutions'),
            },
            {
              fieldId: serviceBlueprint.fields[1].id,
              value: JSON.stringify('ABC Company'),
            },
            {
              fieldId: serviceBlueprint.fields[2].id,
              value: JSON.stringify('Website development and maintenance'),
            },
            {
              fieldId: serviceBlueprint.fields[3].id,
              value: JSON.stringify('$50,000'),
            },
            {
              fieldId: serviceBlueprint.fields[4].id,
              value: JSON.stringify('2024-01-01'),
            },
            {
              fieldId: serviceBlueprint.fields[5].id,
              value: JSON.stringify('2024-12-31'),
            },
          ],
        },
      },
    })

    await prisma.contract.create({
      data: {
        name: 'Employment Contract - Bob Johnson',
        blueprintId: employmentBlueprint.id,
        status: 'LOCKED',
        fields: {
          create: [
            {
              fieldId: employmentBlueprint.fields[0].id,
              value: JSON.stringify('Bob Johnson'),
            },
            {
              fieldId: employmentBlueprint.fields[1].id,
              value: JSON.stringify('Data Analyst'),
            },
            {
              fieldId: employmentBlueprint.fields[2].id,
              value: JSON.stringify('2023-06-01'),
            },
            {
              fieldId: employmentBlueprint.fields[3].id,
              value: JSON.stringify('$80,000'),
            },
            {
              fieldId: employmentBlueprint.fields[4].id,
              value: JSON.stringify(true),
            },
          ],
        },
      },
    })

    return NextResponse.json({
      message: 'Database seeded successfully!',
      blueprints: 3,
      contracts: 5,
    })
  } catch (error: any) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    )
  }
}
