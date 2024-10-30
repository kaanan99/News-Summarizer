import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { baseTopicSchema, createTopicSchema } from "./schema";

// export const GET = async (req: NextApiRequest)  => {
//     try {
//         const { topicType } = req.query

//         console.log(topicType)
//         console.log("in specific route search")
//         const topic = await prisma.topic.findFirst({
//             where: { topic_type: topicType }
//         });

//         if (!topic) {
//             return NextResponse.json({
//                 status: 404,
//                 message: "Topic type not found"
//             }, { status: 404 });
//         }
        
//         return NextResponse.json({
//             status: 200,
//             message: "OK",
//             data: topic
//         });

//     } catch (error) {
//         console.error("Error fetching topic:", error);
//         return NextResponse.json({
//             status: 500,
//             message: "Failed to fetch topic"
//         }, { status: 500 });
//     }
// };

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const parsed_body = createTopicSchema.parse(body);

        const newTopic = await prisma.topic.create({
            data: parsed_body
        });

        return NextResponse.json({
            status: 201,
            message: "Topic created successfully",
            data: newTopic,
        });
    } catch (error) {
        console.error("Error creating topic:", error);
        return new NextResponse("Failed to create topic", { status: 500 });
    }
};

export const DELETE = async (req: Request) => {
    try {
        const body = await req.json();
        const topic_type = baseTopicSchema.parse(body);

        const deleted_topic = await prisma.topic.delete({
            where: topic_type
        });

        return NextResponse.json({
            status: 200,
            message: "Topic deleted successfully",
            data: deleted_topic,
        });
    } catch (error) {
        console.error("Error deleting topic:", error);
        return new NextResponse("Failed to delete topic", { status: 500 });
    }
};